import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { CopyIcon, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userCreationSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { ToastAction } from "@radix-ui/react-toast";

const ModalCreateUser = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof userCreationSchema>>({
    resolver: zodResolver(userCreationSchema),
  });

  function onSubmit(data: z.infer<typeof userCreationSchema>) {
    try {
      axios.post("/api/user", {
        name: data.name,
        username: data.username,
        password: data.password,
      });

      toast({
        title: "User created successfully.",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
        action: (
          <ToastAction
            onClick={() =>
              navigator.clipboard.writeText(
                JSON.stringify(
                  {
                    data,
                  },
                  null,
                  2
                )
              )
            }
            altText="Copy JSON"
          >
            <CopyIcon />
          </ToastAction>
        ),
      });

      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="xs:ml-2 sm:ml-5 dark:bg-gray-700 shadow xs:p-2 sm:px-4 sm:py-2"
        >
          <Plus className="xs:mr-0 sm:mr-2 w-5 h-5 sm:block xs:block" />
          <span className="sm:block xs:hidden">Create User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create a new user by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Name</Label>
                  <Input
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter name"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Username</Label>
                  <Input
                    type="username"
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter username"
                    required
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Password</Label>
                  <Input
                    type="text"
                    onChange={field.onChange}
                    defaultValue={field.value}
                    className="col-span-3"
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCreateUser;
